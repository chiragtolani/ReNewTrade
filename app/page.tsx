import dynamic from "next/dynamic"
import ClientWrapper from "@/components/client-wrapper"

const Dashboard = dynamic(() => import("@/components/dashboard"), {
  ssr: false
})

export default function Home() {
  return (
    <ClientWrapper>
      <Dashboard activeTab="overview" />
    </ClientWrapper>
  )
}
