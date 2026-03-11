import { Menu } from 'lucide-react';
import { useRouter } from 'next/router';

export default function Header({ onToggleSidebar }) {
  const router = useRouter();
  const { locale, pathname, asPath, query } = router;

  const handleLocaleChange = (e) => {
    const newLocale = e.target.value;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center space-x-4">
        <button onClick={onToggleSidebar} className="p-2 rounded-md md:hidden hover:bg-gray-100">
          <Menu size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Language Lens</h1>
      </div>
      <div>
        <select onChange={handleLocaleChange} value={locale} className="p-2 border rounded-md">
          <option value="en">English</option>
          <option value="zh">中文</option>
        </select>
      </div>
    </header>
  );
}
