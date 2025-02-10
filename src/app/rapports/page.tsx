import RapportsTable from "@/components/rapports/RapportsTable";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export default function RapportsPage() {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Liste des rapports" />
      <RapportsTable />
    </DefaultLayout>
  );
}
