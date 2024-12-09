import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_TASKS } from "../graphql/queries"; // Update the import to use the correct query
import { Card, CardTitle } from "../components/Card";
import { BarChart3, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useDrag, useDrop } from "react-dnd";

export default function Dashboard() {
  const { loading, error, data } = useQuery(GET_TASKS, {
    variables: { status: "PLANNING" },
  });

  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    if (data && data.tasks) {
      setTasks(data.tasks);
    }
  }, [data]);

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error loading tasks: {error.message}</p>;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;
  const planningTasks = tasks.filter(
    (task) => task.status === "PLANNING"
  ).length;

  const moveTask = (taskId: string, status: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id_task === taskId ? { ...task, status } : task
    );
    setTasks(updatedTasks);
  };

  const Task = ({ task }: { task: any }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "TASK",
      item: { taskId: task.id_task, status: task.status },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    const getStatusColor = (status: string) => {
      switch (status) {
        case "COMPLETED":
          return "bg-green-100 text-green-700";
        case "IN_PROGRESS":
          return "bg-yellow-100 text-yellow-700";
        case "PLANNING":
          return "bg-blue-100 text-blue-700";
        default:
          return "bg-gray-100 text-gray-700";
      }
    };

    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case "HIGH":
          return "bg-red-100 text-red-700";
        case "MEDIUM":
          return "bg-orange-100 text-orange-700";
        case "LOW":
          return "bg-green-100 text-green-700";
        default:
          return "bg-gray-100 text-gray-700";
      }
    };

    const formatDeadline = (deadline: string) => {
      return new Date(Number(deadline)).toLocaleString();
    };

    return (
      <div
        ref={drag}
        className={`p-6 space-y-4 border rounded-lg shadow-md transition-transform transform ${
          isDragging ? "opacity-50" : "hover:scale-105"
        }`}
        style={{ cursor: "move" }}
      >
        {/* Title */}
        <h4 className="text-lg font-semibold text-gray-900">{task.title}</h4>

        {/* Status */}
        <div
          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
            task.status
          )}`}
        >
          {task.status}
        </div>

        {/* Priority */}
        <div
          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
            task.priority
          )}`}
        >
          {task.priority}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600">{task.description}</p>

        {/* Deadline */}
        {task.deadline && (
          <p className="text-sm text-gray-500">
            <span className="font-medium">Deadline:</span>{" "}
            {formatDeadline(task.deadline)}
          </p>
        )}
      </div>
    );
  };

  const Column = ({
    status,
    children,
  }: {
    status: string;
    children: React.ReactNode;
  }) => {
    const [, drop] = useDrop(() => ({
      accept: "TASK",
      drop: (item: any) => {
        if (item.status !== status) {
          moveTask(item.taskId, status);
        }
      },
    }));

    return (
      <div ref={drop} className="space-y-4 w-1/3">
        <h2 className="text-xl font-semibold">{status}</h2>
        {children}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total de Tareas</p>
            <p className="text-2xl font-semibold text-gray-900">{totalTasks}</p>
          </div>
        </Card>
        <Card className="flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Completadas</p>
            <p className="text-2xl font-semibold text-gray-900">
              {completedTasks}
            </p>
          </div>
        </Card>
        <Card className="flex items-center space-x-4">
          <div className="p-3 bg-yellow-100 rounded-lg">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">En Progreso</p>
            <p className="text-2xl font-semibold text-gray-900">
              {inProgressTasks}
            </p>
          </div>
        </Card>
        <Card className="flex items-center space-x-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <AlertCircle className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Planificación</p>
            <p className="text-2xl font-semibold text-gray-900">
              {planningTasks}
            </p>
          </div>
        </Card>
      </div>

      <div className="flex space-x-6">
        <Column status="PLANNING">
          {tasks
            .filter((task) => task.status === "PLANNING")
            .map((task) => (
              <Task key={task.id_task} task={task} />
            ))}
        </Column>

        <Column status="IN_PROGRESS">
          {tasks
            .filter((task) => task.status === "IN_PROGRESS")
            .map((task) => (
              <Task key={task.id_task} task={task} />
            ))}
        </Column>

        <Column status="COMPLETED">
          {tasks
            .filter((task) => task.status === "COMPLETED")
            .map((task) => (
              <Task key={task.id_task} task={task} />
            ))}
        </Column>
      </div>
    </div>
  );
}
