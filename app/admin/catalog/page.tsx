import { AdminShell } from "@/components/admin/admin-shell";
import { CatalogClient } from "@/components/admin/catalog-client";
import { getAdminCatalogSnapshot } from "@/lib/store/repository";

export default async function AdminCatalogPage() {
  const catalog = await getAdminCatalogSnapshot();

  return (
    <AdminShell title="Catálogo y precios">
      <CatalogClient categories={catalog.categories} products={catalog.products} />
    </AdminShell>
  );
}
