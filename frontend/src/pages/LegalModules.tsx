
import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock legal modules data
const MODULES = [
  {
    id: "indian-constitution",
    title: "Indian Constitution",
    description: "Learn about fundamental rights, duties, and the structure of the Indian Constitution",
    topics: [
      "Historical background and formation",
      "Fundamental Rights and Duties",
      "Directive Principles of State Policy",
      "Union and State Legislature",
      "Amendments and Judiciary"
    ]
  },
  {
    id: "criminal-law",
    title: "Criminal Law",
    description: "Understand the principles of criminal law, IPC, and criminal procedures in India",
    topics: [
      "Indian Penal Code (IPC)",
      "Criminal Procedure Code (CrPC)",
      "Defenses in Criminal Law",
      "Types of Crimes",
      "Punishments and Sentences"
    ]
  },
  {
    id: "family-law",
    title: "Family Law",
    description: "Explore marriage, divorce, inheritance, and maintenance laws under various personal laws",
    topics: [
      "Marriage Laws",
      "Divorce and Maintenance",
      "Inheritance and Succession",
      "Guardianship and Adoption",
      "Domestic Violence Act"
    ]
  },
  {
    id: "cyber-law",
    title: "Cyber Law",
    description: "Learn about legal aspects of cybercrimes and digital transactions in India",
    topics: [
      "Information Technology Act, 2000",
      "Cyber Crimes",
      "Digital Transactions and e-Commerce",
      "Data Protection and Privacy Laws",
      "Cyber Terrorism and National Security"
    ]
  },
  {
    id: "property-rights",
    title: "Property Rights",
    description: "Understand property ownership, transfer, registration, and related legal aspects",
    topics: [
      "Ownership of Property",
      "Transfer of Property Act, 1882",
      "Registration of Property",
      "Inheritance of Property",
      "Property Disputes and Remedies"
    ]
  },
  {
    id: "consumer-rights",
    title: "Consumer Rights",
    description: "Learn about consumer protection laws, rights, and remedies for consumer disputes",
    topics: [
      "Consumer Protection Act, 2019",
      "Consumer Rights",
      "Consumer Disputes and Redressal",
      "Unfair Trade Practices",
      "E-Commerce and Consumer Protection"
    ]
  }
];

export default function LegalModules() {
  const { translate } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {translate("Legal Modules")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {translate("Informative resources about various legal topics.")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((module) => (
            <Card key={module.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {translate(module.title)}
                </CardTitle>
                <CardDescription>
                  {translate(module.description)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm font-medium mb-2">{translate("Key Topics")}:</p>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  {module.topics.map((topic, index) => (
                    <li key={index}>{translate(topic)}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" className="w-full gap-1">
                  {translate("Open Module")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
