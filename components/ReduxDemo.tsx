"use client";

import {
  useAppDispatch,
  useAppSelector,
  increment,
  decrement,
  reset,
  addContact,
  removeContact,
  type Contact,
} from "@/lib/store";
import { Button } from "@/components/ui/button";

const SAMPLE_CONTACTS: Omit<Contact, "id">[] = [
  { name: "Alice Johnson", email: "alice@acme.com", company: "Acme", status: "active" },
  { name: "Bob Smith", email: "bob@globex.com", company: "Globex", status: "lead" },
];

export function ReduxDemo() {
  const dispatch = useAppDispatch();
  const count = useAppSelector((s) => s.counter.value);
  const contacts = useAppSelector((s) => s.contacts.items);

  return (
    <div className="w-full flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Redux Toolkit — Counter</h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Count: <span className="font-mono font-semibold">{count}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => dispatch(decrement())}>−</Button>
          <Button onClick={() => dispatch(increment())}>+</Button>
          <Button variant="outline" onClick={() => dispatch(reset())}>
            Reset
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Redux Toolkit — Contacts</h2>
        {contacts.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">No contacts yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {contacts.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-md border border-border px-3 py-2"
              >
                <span>
                  {c.name} — {c.email}
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => dispatch(removeContact(c.id))}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
        <Button
          variant="secondary"
          onClick={() => dispatch(addContact(SAMPLE_CONTACTS[contacts.length % 2]))}
        >
          Add sample contact
        </Button>
      </section>
    </div>
  );
}
