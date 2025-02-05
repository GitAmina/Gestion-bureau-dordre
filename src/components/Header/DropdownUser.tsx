import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import ClickOutside from "@/components/ClickOutside";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false); // Vérification si on est côté client
  //const router = useRouter();

  // Vérification si on est côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) { // Vérifie si le composant est monté côté client
      const fetchUser = async () => {
        try {
          console.log("🔍 Récupération des infos utilisateur...");
          const response = await fetch("/api/auth/user");
          console.log("✅ Réponse reçue:", response);

          if (!response.ok) {
            throw new Error(`Erreur API (${response.status}): ${response.statusText}`);
          }

          const data = await response.json();
          console.log("✅ Données utilisateur récupérées:", data);

          setUser(data);
        } catch (error) {
          console.error("❌ Erreur lors de la récupération des données utilisateur:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [isClient]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
   // router.push('/login');
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
      >
        <span className="h-12 w-12 rounded-full overflow-hidden">
          <Image
            width={48}
            height={48}
            src="/images/user/default-avatar.jpeg"
            alt="Avatar utilisateur"
            className="rounded-full"
          />
        </span>

        <span className="flex items-center gap-2 font-medium text-dark dark:text-gray-300">
          <span className="hidden lg:block">
            {loading ? "Chargement..." : user?.nom || "Utilisateur"}
          </span>

          <svg
            className={`fill-current duration-200 ease-in ${dropdownOpen ? "rotate-180" : ""}`}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.6921 7.09327C3.91674 6.83119 4.3113 6.80084 4.57338 7.02548L9.99997 11.6768L15.4266 7.02548C15.6886 6.80084 16.0832 6.83119 16.3078 7.09327C16.5325 7.35535 16.5021 7.74991 16.24 7.97455L10.4067 12.9745C10.1727 13.1752 9.82728 13.1752 9.59322 12.9745L3.75989 7.97455C3.49781 7.74991 3.46746 7.35535 3.6921 7.09327Z"
            />
          </svg>
        </span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-3 w-[280px] rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
            <span className="h-12 w-12 rounded-full overflow-hidden">
              <Image
                width={48}
                height={48}
                src="/images/user/default-avatar.jpeg"
                alt="Avatar utilisateur"
                className="rounded-full"
              />
            </span>
            <div>
              <p className="font-medium text-dark dark:text-white">
                {loading ? "Chargement..." : user?.name || "Utilisateur"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {loading ? "Chargement..." : user?.email || "email@example.com"}
              </p>
            </div>
          </div>
          <ul className="p-2">
            <li>
              <Link href="/profile" className="block p-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                Voir le profil
              </Link>
            </li>
            <li>
              <Link href="/settings" className="block p-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                Paramètres
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left p-2 text-sm text-red-500 hover:bg-red-100 dark:hover:bg-red-600 dark:hover:text-white"
              >
                Déconnexion
              </button>
            </li>
          </ul>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;
