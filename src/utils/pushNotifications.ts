// src/utils/pushNotifications.ts
// Web push notifications via Firebase Cloud Messaging.
//
// initPushNotifications() is the single entry point — call it once after a
// successful login. Everything here fails soft: unsupported browsers, denied
// permission, or a missing backend endpoint all resolve to no-ops instead of
// throwing, so this can never break the login flow.
import toast from "react-hot-toast";
import { getToken, onMessage, type Unsubscribe } from "firebase/messaging";
import api from "@/config/axios";
import { firebaseConfig, getFirebaseMessaging } from "@/config/firebase";
import { env } from "@/config/env";
import { emitNewNotification } from "@/utils/notificationBus";
import { useAuthStore } from "@/store/authStore";

export const FCM_TOKEN_STORAGE_KEY = "fcm_token";

const isPushSupported = () =>
  typeof window !== "undefined" &&
  "Notification" in window &&
  "serviceWorker" in navigator;

// ── Permission ────────────────────────────────────────────────────────────────
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!isPushSupported()) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;

  const result = await Notification.requestPermission();
  return result === "granted";
};

// ── Service worker registration ──────────────────────────────────────────────
// Firebase's own public web config (apiKey, projectId, etc.) is passed via
// query params so firebase-messaging-sw.js can initialize itself — see that
// file for why it can't just import from src/config/firebase.ts directly.
const registerFcmServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!isPushSupported()) return null;

  const params = new URLSearchParams({
    apiKey: firebaseConfig.apiKey ?? "",
    authDomain: firebaseConfig.authDomain ?? "",
    projectId: firebaseConfig.projectId ?? "",
    storageBucket: firebaseConfig.storageBucket ?? "",
    messagingSenderId: firebaseConfig.messagingSenderId ?? "",
    appId: firebaseConfig.appId ?? "",
  });

  try {
  const registration = await navigator.serviceWorker.register(
  `/firebase-messaging-sw.js?${params.toString()}`
);

await navigator.serviceWorker.ready;

return registration;
  } catch (err) {
    console.error("[push] Service worker registration failed:", err);
    return null;
  }
};

// ── Token retrieval ───────────────────────────────────────────────────────────
export const getFcmToken = async (): Promise<string | null> => {
  if (!env.FIREBASE_VAPID_KEY) {
    console.warn("[push] VITE_FIREBASE_VAPID_KEY is not set — skipping token retrieval.");
    return null;
  }

  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;

  const swRegistration = await registerFcmServiceWorker();
  if (!swRegistration) return null;

  try {
    const token = await getToken(messaging, {
      vapidKey: env.FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    });
    return token || null;
  } catch (err) {
    console.error("[push] Failed to retrieve FCM token:", err);
    return null;
  }
};

// ── Backend sync ──────────────────────────────────────────────────────────────
// Persists the token now; sending it to the backend is a separate step so it
// can be wired up whenever the corresponding endpoint exists server-side.
export const storeFcmTokenLocally = (token: string): void => {
  localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
};

export const getStoredFcmToken = (): string | null =>
  localStorage.getItem(FCM_TOKEN_STORAGE_KEY);

// Best-effort browser label — good enough to tell devices apart in a "manage
// sessions" list without pulling in a full UA-parsing dependency.
const getDeviceName = (): string => {
  const ua = navigator.userAgent;
  const browser =
    (ua.match(/Edg\//) && "Edge") ||
    (ua.match(/Chrome\//) && "Chrome") ||
    (ua.match(/Firefox\//) && "Firefox") ||
    (ua.match(/Safari\//) && "Safari") ||
    "Browser";
  const os =
    (ua.match(/Windows/) && "Windows") ||
    (ua.match(/Mac OS X/) && "macOS") ||
    (ua.match(/Android/) && "Android") ||
    (ua.match(/iPhone|iPad/) && "iOS") ||
    (ua.match(/Linux/) && "Linux") ||
    "Unknown OS";
  return `${browser} on ${os}`;
};

// Backend only accepts these three device-token owner types — Admin,
// SchoolAdmin, Teacher, and Accountant are all "staff" from its perspective.
const DEVICE_TOKEN_USER_TYPE_MAP: Record<string, "student" | "staff" | "parent"> = {
  Student:     "student",
  Parent:      "parent",
  Teacher:     "staff",
  Admin:       "staff",
  SchoolAdmin: "staff",
  Accountant:  "staff",
  SuperAdmin:  "staff",
};

// ── System notification dedupe ───────────────────────────────────────────────
// Every notification type needs to reach the OS notification center, whether
// it arrives via an FCM push (attendance today) or is merely discovered by
// polling /tenant/getallnotifications (homework, exams, fees, etc. — the
// backend doesn't push those yet). Both paths funnel through
// showSystemNotification, so the same notification id is never shown twice
// regardless of which path saw it first.
const NOTIFIED_IDS_KEY = "vt_notified_notification_ids";
const MAX_TRACKED_IDS = 500;
const SEEDED_ONCE_KEY = "vt_notifications_seeded_once";

const getNotifiedIds = (): string[] => {
  try {
    const raw = localStorage.getItem(NOTIFIED_IDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const hasBeenNotified = (id: string): boolean => getNotifiedIds().includes(id);

const markAsNotified = (id: string): void => {
  const ids = getNotifiedIds();
  if (ids.includes(id)) return;
  ids.push(id);
  localStorage.setItem(NOTIFIED_IDS_KEY, JSON.stringify(ids.slice(-MAX_TRACKED_IDS)));
};

/**
 * Marks the given ids as already-notified the first time it's ever called in
 * this browser, without showing anything — so a user's pre-existing
 * notification history doesn't flood the OS notification center the first
 * time the app loads. Returns true only on that first-ever call; every call
 * after that is a no-op (the caller should then notify normally).
 */
export const seedNotificationHistoryOnce = (ids: string[]): boolean => {
  if (localStorage.getItem(SEEDED_ONCE_KEY) === "1") return false;
  const known = new Set(getNotifiedIds());
  ids.forEach((id) => known.add(id));
  localStorage.setItem(NOTIFIED_IDS_KEY, JSON.stringify(Array.from(known).slice(-MAX_TRACKED_IDS)));
  localStorage.setItem(SEEDED_ONCE_KEY, "1");
  return true;
};

export interface SystemNotificationInput {
  id: string;
  title: string;
  body: string;
  icon?: string;
}

/**
 * Shows one OS-level notification for the given id, at most once ever per
 * browser. Shared by the FCM foreground handler and the notification-list
 * poller in useNotifications so every notification type reaches the system
 * tray exactly once, regardless of which path surfaces it first.
 */
export const showSystemNotification = async ({ id, title, body, icon }: SystemNotificationInput): Promise<void> => {
  if (!isPushSupported()) return;
  if (Notification.permission !== "granted") return;
  if (hasBeenNotified(id)) return;

  const options = {
    body,
    icon: icon || "/favicon.png",
    badge: "/favicon.png",
    tag: `vidyatracker-notification-${id}`,
    data: { id },
  };

  // Note: we can't use `new Notification(...)` once a service worker is
  // registered and controlling the page — some browsers (notably Chrome on
  // Android) throw "Illegal constructor" on the page-level Notification
  // constructor there; notifications must go through the SW registration.
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration) {
    registration.showNotification(title, options);
  } else {
    new Notification(title, options);
  }

  markAsNotified(id);
};

export const sendFcmTokenToBackend = async (token: string): Promise<void> => {
  const { user } = useAuthStore.getState();
  const normalizedUserType = user?.userType
    ? Object.keys(DEVICE_TOKEN_USER_TYPE_MAP).find(
        (key) => key.toLowerCase() === user.userType.toLowerCase()
      )
    : undefined;
  const userType = normalizedUserType ? DEVICE_TOKEN_USER_TYPE_MAP[normalizedUserType] : undefined;
  if (!user?.id || !userType) {
    console.warn(
      "[push] Skipping FCM token sync — no authenticated user yet.",
      { rawUserId: user?.id, rawUserType: user?.userType, mappedUserType: userType }
    );
    return;
  }

  try {
    await api.post("/tenant/registerdevicetoken", {
      user_id: user.id,
      user_type: userType,
      fcm_token: token,
      device_type: "web",
      device_name: getDeviceName(),
    });
  } catch (err) {
    console.warn("[push] Could not sync FCM token with backend yet:", err);
  }
};

// ── Foreground messages ───────────────────────────────────────────────────────
// Background/closed-app pushes are handled by firebase-messaging-sw.js instead.
export const listenForForegroundMessages = async (
  onNotification?: (payload: { title: string; body: string }) => void
): Promise<Unsubscribe | null> => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;

  return onMessage(messaging, async (payload) => {
    const title = payload.notification?.title ?? "New notification";
    const body = payload.notification?.body ?? "";
    // Prefer the backend's own notification row id (if it sent one) so this
    // dedupes correctly against the same row surfacing later via polling.
    const id =
      (payload.data?.id as string | undefined) ||
      (payload.data?.notification_id as string | undefined) ||
      payload.messageId ||
      `${title}::${body}`;

    toast(body ? `${title} — ${body}` : title);

    // onMessage only fires while the tab is focused — the service worker's
    // onBackgroundMessage handles the tab-unfocused/closed case. Foreground
    // pushes need their own OS-level Notification, or they'd only ever show
    // as an in-page toast and never reach the system notification center.
    await showSystemNotification({ id, title, body, icon: payload.notification?.icon });

    onNotification?.({ title, body });
    emitNewNotification();
  });
};

// ── Orchestrator ──────────────────────────────────────────────────────────────
// Call once after a successful login. Safe to call multiple times or in
// browsers/environments where push isn't available.
export const initPushNotifications = async (): Promise<void> => {
  try {
    const granted = await requestNotificationPermission();
    if (!granted) return;

    const token = await getFcmToken();
    if (!token) return;

    storeFcmTokenLocally(token);
    await sendFcmTokenToBackend(token);
    await listenForForegroundMessages();
  } catch (err) {
    console.error("[push] initPushNotifications failed:", err);
  }
};