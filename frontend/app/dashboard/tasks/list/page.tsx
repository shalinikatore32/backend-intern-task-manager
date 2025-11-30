"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);

  const [editTask, setEditTask] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const [deleteTask, setDeleteTask] = useState<any>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const loadTasks = async () => {
    const data = await apiRequest("/tasks", "GET", null, token as string);
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const toggleComplete = async (task: any) => {
    await apiRequest(
      `/tasks/${task.id}`,
      "PUT",
      { is_completed: !task.is_completed },
      token as string
    );
    loadTasks();
  };

  const handleEditSave = async () => {
    await apiRequest(
      `/tasks/${editTask.id}`,
      "PUT",
      { title: editTitle, description: editDesc },
      token as string
    );

    setEditTask(null);
    loadTasks();
  };

  const handleDelete = async () => {
    await apiRequest(
      `/tasks/${deleteTask.id}`,
      "DELETE",
      null,
      token as string
    );
    setDeleteTask(null);
    loadTasks();
  };

  return (
    <div className="space-y-3">
      {tasks.length === 0 ? (
        <div className="text-center text-gray-500 py-10 border rounded-lg bg-white shadow-sm">
          <p className="text-lg font-medium">No tasks yet</p>
          <p className="text-sm">Start by creating a new task.</p>
        </div>
      ) : (
        tasks.map((task: any) => (
          <div
            key={task.id}
            className="border p-4 rounded-lg bg-white shadow-sm flex justify-between items-start"
          >
            <div className="space-y-1">
              <p
                className={`text-lg font-semibold ${
                  task.is_completed ? "line-through text-gray-400" : ""
                }`}
              >
                {task.title}
              </p>
              <p className="text-sm text-gray-500">{task.description}</p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="secondary"
                onClick={() => toggleComplete(task)}
                className="w-24"
              >
                {task.is_completed ? "Undo" : "Done"}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setEditTask(task);
                  setEditTitle(task.title);
                  setEditDesc(task.description);
                }}
                className="w-24"
              >
                Edit
              </Button>

              <Button
                variant="destructive"
                onClick={() => setDeleteTask(task)}
                className="w-24"
              >
                Delete
              </Button>
            </div>
          </div>
        ))
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editTask} onOpenChange={() => setEditTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleEditSave}>Save</Button>
            <Button variant="outline" onClick={() => setEditTask(null)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTask} onOpenChange={() => setDeleteTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task?</DialogTitle>
          </DialogHeader>

          <p className="text-gray-600">
            This action cannot be undone. Are you sure?
          </p>

          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="outline" onClick={() => setDeleteTask(null)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
