import NavHeader from "@/components/NavHeader"

export default function Home() {
  return (
    <div>
      <NavHeader />
      <div className="p-4">
        <h1 className="text-xl font-semibold">Home</h1>
        <p>Bem-vindo ao app!</p>
      </div>
    </div>
  )
}


