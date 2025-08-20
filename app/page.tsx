import TrackerLoader from "./component/TrackLoader";

export default function Home() {
  return (
    <main className="min-h-screen w-full p-4 sm:p-8 flex flex-col items-center bg-gray-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.3),rgba(255,255,255,0))]">
    
      <TrackerLoader />
      
    </main>
  );
}