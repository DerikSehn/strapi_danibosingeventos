import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useActionState } from 'react';
import axios from 'axios';
import { ZodErrors } from '@/components/custom/zod-errors';
import { StrapiErrors } from '@/components/custom/strapi-errors';
import { SubmitButton } from '@/components/custom/submit-button';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';

interface Budget {
    id: string;
    title: string;
    description: string;
    eventDetails: string;
    eventDuration: number;
    extraHours: number;
    numberOfPeople: number;
    totalPrice: number;
    numberOfWaiters: number;
    eventDate: string;
}

const INITIAL_STATE = {
    zodErrors: null,
    strapiErrors: null,
    data: null,
    message: null,
};

export default function BudgetDetails({ budget }: { budget: Budget }) {
    const [formState, formAction] = useActionState(updateBudgetAction, INITIAL_STATE);

    return (
        <div className="w-full max-w-md mx-auto">
            <h1>Detalhes do Orçamento</h1>

            <form action={formAction}>
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" defaultValue={budget.title} />
                    <ZodErrors error={formState?.zodErrors?.title} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" name="description" defaultValue={budget.description} />
                    <ZodErrors error={formState?.zodErrors?.description} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="eventDetails">Event Details</Label>
                    <textarea id="eventDetails" name="eventDetails" defaultValue={budget.eventDetails} />
                    <ZodErrors error={formState?.zodErrors?.eventDetails} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="eventDuration">Event Duration</Label>
                    <Input id="eventDuration" name="eventDuration" type="number" defaultValue={budget.eventDuration} />
                    <ZodErrors error={formState?.zodErrors?.eventDuration} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="extraHours">Extra Hours</Label>
                    <Input id="extraHours" name="extraHours" type="number" defaultValue={budget.extraHours} />
                    <ZodErrors error={formState?.zodErrors?.extraHours} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="numberOfPeople">Number of People</Label>
                    <Input id="numberOfPeople" name="numberOfPeople" type="number" defaultValue={budget.numberOfPeople} />
                    <ZodErrors error={formState?.zodErrors?.numberOfPeople} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="totalPrice">Total Price</Label>
                    <Input id="totalPrice" name="totalPrice" type="number" defaultValue={budget.totalPrice} />
                    <ZodErrors error={formState?.zodErrors?.totalPrice} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="numberOfWaiters">Number of Waiters</Label>
                    <Input id="numberOfWaiters" name="numberOfWaiters" type="number" defaultValue={budget.numberOfWaiters} />
                    <ZodErrors error={formState?.zodErrors?.numberOfWaiters} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="eventDate">Event Date</Label>
                    <Input id="eventDate" name="eventDate" type="datetime-local" defaultValue={new Date(budget.eventDate).toISOString().slice(0, 16)} />
                    <ZodErrors error={formState?.zodErrors?.eventDate} />
                </div>
                <SubmitButton className="w-full" text="Save" loadingText="Saving" />
                <StrapiErrors error={formState?.strapiErrors} />
            </form>

        </div>
    );
}

async function updateBudgetAction(data: Budget) {
    try {
        const response = await axios.put(`/api/budgets/${data.id}`, data);
        return response.data;
    } catch (error) {
        console.error('An error occurred while updating the budget:', error);
        throw error;
    }
}