"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export default function AddTask() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleAdd = async (e: any) => {
    e.preventDefault();

    try {
      await apiRequest(
        "/tasks",
        "POST",
        {
          title,
          description: desc,
          is_completed: false,
        },
        token as string
      );

      toast.success("Task added successfully!");

      setTitle("");
      setDesc("");
    } catch (err: any) {
      toast.error(err.message || "Failed to create task.");
    }
  };

  return (
    <form className="space-y-4 max-w-lg" onSubmit={handleAdd}>
      <h1 className="text-xl font-semibold">Add New Task</h1>

      <Input
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <Input
        placeholder="Task Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <Button type="submit">Add Task</Button>
    </form>
  );
}
