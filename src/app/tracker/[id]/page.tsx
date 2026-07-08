"use client";

import { use } from "react";
import ApplicationDetailClient from "./ApplicationDetailClient";

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  
  return <ApplicationDetailClient id={unwrappedParams.id} />;
}
