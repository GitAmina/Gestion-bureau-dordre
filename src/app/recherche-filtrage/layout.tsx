// src/app/recherche-filtrage/layout.tsx

export const metadata = {
    title: "Page de Recherche et Filtrage",
    description: "Rechercher et filtrer les courriers par référence, expéditeur, destinataire, etc.",
  };
  
  export default function RechercheFiltrageLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <>{children}</>;
  }
  