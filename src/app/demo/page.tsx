import DemoGate from "@/components/demo/DemoGate";
import PatientPortal from "@/components/patient/PatientPortal";

export default function DemoPage() {
  return (
    <DemoGate>
      <PatientPortal />
    </DemoGate>
  );
}
