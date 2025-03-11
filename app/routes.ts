import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/tasksList.tsx"),
  ...prefix("tasks", [
    route("new", "routes/addTask.tsx"),
    route(":id", "routes/taskDetails.tsx"),
  ]),
] satisfies RouteConfig;
