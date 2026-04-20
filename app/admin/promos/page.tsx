import { AdminShell } from "@/components/admin/admin-shell";
import { PromosClient } from "@/components/admin/promos-client";
import { isR2Configured } from "@/lib/env";
import { listAdminPromos } from "@/lib/store/promos";
import { getAdminCatalogSnapshot } from "@/lib/store/repository";

export default async function AdminPromosPage() {
  const [promos, catalog] = await Promise.all([
    listAdminPromos(),
    getAdminCatalogSnapshot(),
  ]);

  return (
    <AdminShell title="Promociones y banners">
      <PromosClient
        promos={promos}
        products={catalog.products}
        storageReady={isR2Configured()}
      />
    </AdminShell>
  );
}
