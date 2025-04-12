import ClientWrapper from "@/components/client-wrapper"
import ClientDashboard from "@/components/client-dashboard"

export default function Home() {
  return (
    <ClientWrapper>
      <div className="flex flex-col gap-4">
        <ClientDashboard activeTab="overview" />
      </div>
    </ClientWrapper>
  )
}
