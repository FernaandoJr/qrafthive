import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ButtonLink({ path, name }: { path: string; name: string }) {
  return (
    <Button asChild variant="link">
      <Link href={path}>{name}</Link>
    </Button>
  )
}
