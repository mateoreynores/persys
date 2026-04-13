import { NextResponse } from "next/server";

import { createOrder } from "@/lib/store/repository";
import { checkoutSchema } from "@/lib/store/types";

export async function POST(request: Request) {
  try {
    const payload = checkoutSchema.parse(await request.json());
    const order = await createOrder(payload);

    return NextResponse.json({
      orderId: order.id,
      whatsAppUrl: order.whatsAppUrl,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "No se pudo registrar el pedido.",
      },
      { status: 400 },
    );
  }
}
