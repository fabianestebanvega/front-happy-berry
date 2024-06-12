import * as Tabs from "@radix-ui/react-tabs";
import ProductosAdmin from "./View/Productos/Productos";
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';

const Tabsmenu = () => {
  const tabItems = [
    {
      icon: <Inventory2Icon />,
      name: "Productos",
      view: <ProductosAdmin />,
    },
    {
      icon: <CategoryIcon />,
      name: "Categorias",
    },
    {
      icon: <ListAltIcon />,
      name: "Pedidos",
    },
    {
      icon: <SupervisedUserCircleIcon />,
      name: "Clientes",
    },
    {
      icon: <AssignmentReturnIcon />,
      name: "Devoluciones",
    },
  ];

  return (
    <Tabs.Root
      className="max-w-screen-xl mx-auto px-4 md:px-8"
      defaultValue={tabItems[0].name} // Selecciona el primer tab por defecto
    >
      <Tabs.List
        className="w-full border-b flex items-center gap-x-3 overflow-x-auto text-sm bg-white border"
        aria-label="Manage your account"
      >
        {tabItems.map((item, idx) => (
          <Tabs.Trigger
            key={idx}
            className="group outline-none py-1.5 border-b-2 border-white text-gray-500 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600"
            value={item.name}
          >
            <div className="flex items-center gap-x-2 py-1.5 px-3 rounded-lg duration-150 group-hover:text-indigo-600 group-hover:bg-gray-50 group-active:bg-gray-100 font-medium">
              {item.icon}
              {item.name}
            </div>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabItems.map((item, idx) => (
        <Tabs.Content key={idx} className="py-6" value={item.name}>
          {item?.view}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};

export default Tabsmenu;
