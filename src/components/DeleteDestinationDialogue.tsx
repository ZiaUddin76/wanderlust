"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Trash2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { deleteDestination } from "@/lib/destinations"
import { getTokenFromClient } from "@/lib/getTokenFromClient"

export function DeleteDestinationDialog({ id }: { id: string }) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  async function handleDelete() {
    setIsDeleting(true)

    const token = await getTokenFromClient()
    const result = await deleteDestination(id, token)

    setIsDeleting(false)

    if (!result.ok) {
      toast.add({
        type: "error",
        title: "Failed to delete travel package",
        description: result.description,
      })
      return
    }

    setOpen(false)

    toast.add({
      type: "success",
      title: "Travel package deleted",
      description: "The travel package has been removed successfully.",
    })

    router.push("/destinations")
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="destructive" className="px-4" />}>
        <Trash2Icon className="size-4" />
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-red-50 text-red-500">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete this travel package?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The travel package will be
            permanently removed from the server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="gap-2 bg-red-600 text-white hover:bg-red-700"
          >
            {isDeleting ? (
              <Spinner className="text-white" />
            ) : (
              <Trash2Icon className="size-4" />
            )}
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
