import { EtapeRunner } from "@/components/activities/EtapeRunner";

// Server Component fin : déballe les params (Promise depuis Next 15) et délègue
// toute la logique interactive au runner client.
export default async function EtapePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EtapeRunner id={id} />;
}
