import Link from 'next/link';
import Image from 'next/image';

export function SiteFooter() {
  return (
    <footer className="w-full text-sm bg-[#F9F1F0] mt-auto">
      <div className="container max-w-7xl mx-auto p-6 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-black">
          <div className="grid gap-2">
            <h3 className="font-semibold text-lg" style={{ color: '#E0B3AF' }}>Ubicación</h3>
            <p>Callejón No. 101, Parque de Ciencia y Tecnología, Ciudad Quantum, C.P. 98090, Edificio Photon Innovation Hub, Piso 3. Zacatecas, Zacatecas</p>
          </div>
          <div className="grid gap-4">
            <h3 className="font-semibold text-lg" style={{ color: '#E0B3AF' }}>Contacto</h3>
            <div className="grid gap-1">
              <p className="font-bold">Nombre</p>
              <p>Puesto</p>
              <a href="mailto:correo@cozcyt.gob.mx" className="hover:underline">correo@cozcyt.gob.mx</a>
            </div>
          </div>
          <div className="grid gap-2">
            <h3 className="font-semibold text-lg" style={{ color: '#E0B3AF' }}>Otros</h3>
            <Link href="#" className="hover:underline">Manual de usuario</Link>
            <Link href="#" className="hover:underline">Acerca de</Link>
            <Link href="#" className="hover:underline">Transparencia</Link>
          </div>
          <div className="flex flex-col items-start md:items-center justify-center gap-4">
            <Image src="https://placehold.co/150x50.png" width={150} height={50} alt="Logo 1" />
            <Image src="https://placehold.co/150x50.png" width={150} height={50} alt="Logo 2" />
          </div>
        </div>
      </div>
      <div style={{ backgroundColor: '#E0B3AF' }} className="py-4 text-black">
        <div className="container max-w-7xl mx-auto flex justify-between items-center">
          <p className="text-xs">© 2025 - 2027 Labsol Network.M Bajo licencia GPL v.3.a</p>
          <a href="#" className="text-xs hover:underline">@Emiliano De Santiago (desarrollador)</a>
        </div>
      </div>
    </footer>
  );
}
