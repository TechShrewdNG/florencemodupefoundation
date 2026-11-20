import { asc } from "drizzle-orm";
import { Trash2 } from "lucide-react";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { deleteUser } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Card, PageHeader } from "@/components/admin/ui";
import { AddUserForm, ChangePasswordForm } from "./user-forms";

export default async function UsersPage() {
  const me = await requireUser();
  const users = await db
    .select({ id: schema.users.id, name: schema.users.name, email: schema.users.email, createdAt: schema.users.createdAt })
    .from(schema.users)
    .orderBy(asc(schema.users.id));
  return (
    <>
      <PageHeader title="Users" description="People who can sign in to this admin panel." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden lg:col-span-2">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-medium">
                    {u.name} {u.id === me.id && <span className="ml-1 text-xs font-normal text-gray-400">(you)</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3 text-right">
                    {u.id !== me.id && (
                      <ConfirmButton action={deleteUser.bind(null, u.id)} confirm={`Remove ${u.name}'s access?`} className="text-gray-400 hover:text-red-600">
                        <Trash2 className="size-4" />
                      </ConfirmButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card className="p-6">
          <h2 className="font-semibold">Add a user</h2>
          <AddUserForm />
        </Card>
        <Card className="p-6">
          <h2 className="font-semibold">Change your password</h2>
          <ChangePasswordForm />
        </Card>
      </div>
    </>
  );
}
