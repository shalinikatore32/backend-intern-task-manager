"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle, XCircle } from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AdminTaskPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const loadTasks = async () => {
    try {
      const data = await apiRequest(
        `${baseUrl}/tasks/admin/all`,
        "GET",
        null,
        token as string
      );
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const toggleComplete = async (task: any) => {
    await apiRequest(
      `${baseUrl}/tasks/${task.id}`,
      "PUT",
      { is_completed: !task.is_completed },
      token as string
    );
    loadTasks();
  };

  const deleteTask = async (taskId: string) => {
    await apiRequest(
      `${baseUrl}/tasks/${taskId}`,
      "DELETE",
      null,
      token as string
    );
    loadTasks();
  };

  useEffect(() => {
    loadTasks();
  }, []);

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Tasks (Admin)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="border rounded-lg p-4 bg-white shadow-sm flex justify-between items-center"
          >
            <div>
              <h2 className="font-bold text-lg">{task.title}</h2>
              <p className="text-gray-600">
                {task.description || "No description"}
              </p>

              <p className="text-xs text-gray-500 mt-2">
                Owner: <span className="font-semibold">{task.owner_id}</span>
              </p>

              <p className="text-xs text-gray-500">
                Created: {new Date(task.created_at).toLocaleString()}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="secondary"
                onClick={() => toggleComplete(task)}
                className={
                  task.is_completed
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }
              >
                {task.is_completed ? (
                  <CheckCircle className="h-4 w-4 mr-1" />
                ) : (
                  <XCircle className="h-4 w-4 mr-1" />
                )}
                {task.is_completed ? "Completed" : "Mark Done"}
              </Button>

              <Button variant="destructive" onClick={() => deleteTask(task.id)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
