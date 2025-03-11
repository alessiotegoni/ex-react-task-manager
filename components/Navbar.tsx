import { NavLink } from "react-router";

export default function Navbar() {
  return (
    <div className="flex justify-between py-5">
      <h1 className="text-2xl font-semibold">Task manager</h1>
      <div className="flex items-center gap-3">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${
              isActive ? "bg-white text-black font-semibold" : "bg-slate-800"
            } p-2 px-3 rounded-lg font-medium`
          }
        >
          Tasks list
        </NavLink>
        <NavLink
          to="/tasks/new"
          className={({ isActive }) =>
            `${
              isActive ? "bg-white text-black font-semibold" : "bg-slate-800"
            } p-2 px-3 rounded-lg font-medium`
          }
        >
          Add Task
        </NavLink>
      </div>
    </div>
  );
}
