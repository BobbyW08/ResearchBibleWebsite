import { WIFI_PANEL } from "@/lib/tech-consequences-data";
import { DevicePanel } from "./device-panel";

export function WifiPanel() {
  return <DevicePanel panel={WIFI_PANEL} parentPhone={null} />;
}
