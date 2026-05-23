import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function PaymentAmount({ amount, onPay }: any) {
  const [custom, setCustom] = useState(false);
  const [value, setValue] = useState(amount);

  return (
    <Card>
      <CardContent className="space-y-3">
        <Button
          className="w-full"
          variant={!custom ? "default" : "outline"}
          onClick={() => {
            setCustom(false);
            setValue(amount);
          }}
        >
          Pay Full Amount
        </Button>

        <Button
          className="w-full"
          variant={custom ? "default" : "outline"}
          onClick={() => setCustom(true)}
        >
          Pay Custom Amount
        </Button>

        {custom && (
          <input
            className="border p-2 rounded-md w-full"
            value={value}
            onChange={(e) =>
              setValue(Number(e.target.value))
            }
          />
        )}

        <Button className="w-full" onClick={() => onPay(value)}>
          Proceed to Pay
        </Button>
      </CardContent>
    </Card>
  );
}