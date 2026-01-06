export default function TrustedCompanies() {
  const companies = [
    { name: "TechCore", color: "bg-gray-600" },
    { name: "Global Solutions", color: "bg-gray-600" },
    { name: "Company", color: "bg-gray-400" },
    { name: "Recruit Co", color: "bg-orange-600" },
    { name: "DataConnect", color: "bg-gray-700" },
  ]

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-gray-600 font-medium text-lg">Trusted by leading companies worldwide</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 items-center">
          {companies.map((company, index) => (
            <div
              key={index}
              className={`h-12 ${company.color} rounded-lg flex items-center justify-center text-white font-semibold text-sm px-4`}
            >
              {company.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
