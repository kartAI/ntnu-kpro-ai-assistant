import Link from 'next/link';

interface BreadcrumbItem {
  name: string;
  route: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index < items.length - 1 ? (
              <Link href={item.route}>
                <a className="text-blue-600 hover:underline">{item.name}</a>
              </Link>
            ) : (
              <span className="font-semibold text-gray-900">{item.name}</span>
            )}
            {index < items.length - 1 && (
              <span className="mx-2 text-gray-500">&gt;</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
