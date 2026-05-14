import { Suspense } from "react";
import PropertyDetailClient from "../../components/PropertyDetailClient";

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense>
      <PropertyDetailClient id={id} />
    </Suspense>
  );
}
