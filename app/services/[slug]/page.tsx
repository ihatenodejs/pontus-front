"use client"

import { ServicesShell } from "@/components/front/services"
import { useParams } from "next/navigation"

export default function Service() {
  const slug = useParams().slug

  return (
    <ServicesShell slug={slug as string} />
  )
}