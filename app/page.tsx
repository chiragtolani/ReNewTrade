import ClientWrapper from "@/components/client-wrapper"
import ClientDashboard from "@/components/client-dashboard"

export default function Home() {
  return (
    <ClientWrapper>
      <ClientDashboard activeTab="overview" />
    </ClientWrapper>
  )
}
