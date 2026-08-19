import { company } from '../../data/company';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-white border-t border-line py-6">
      <div className="max-w-[72rem] mx-auto px-6 md:px-8">
        <p className="text-[0.8125rem] text-body">
          &copy; {year} {company.legalName}
        </p>
      </div>
    </footer>
  );
}
