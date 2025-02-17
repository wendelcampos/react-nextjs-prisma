/* eslint-disable react/react-in-jsx-scope */
import { Button, TextInput, Text } from "@ignite-ui/react";
import { Form, FormAnnotation } from "./styles";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

const ClaimUsernameFormSchema =  z.object({
    username: z
        .string()
        .min(3, { message: 'O nome de usuário deve ter no mínimo 3 caracteres' })
        .regex(/^([a-z\\-]+)$/i, { message: 'O nome de usuário só pode conter letras e hífens' })
        .transform((username) => username.toLowerCase())
})

type ClaimUserNameFormData = z.infer<typeof ClaimUsernameFormSchema>

export function ClaimUsernameForm() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ClaimUserNameFormData>({
        resolver: zodResolver(ClaimUsernameFormSchema),
    })

    const router = useRouter()

    async function handlePreRegister({ username }: ClaimUserNameFormData) {
       await router.push(`/register?username=${username}`)
    }

    return (
        <>
            <Form as="form" onSubmit={handleSubmit(handlePreRegister)}>
                <TextInput size="sm" prefix="ignite.com/" placeholder={'Seu-usuário'} { ...register('username') } />
                <Button size="sm" type="submit" disabled={isSubmitting}>
                    Reservar
                    <ArrowRight />
                </Button>
            </Form>
            <FormAnnotation>
                <Text size="sm">
                    {errors.username ? errors.username.message : 'Digite o nome do usuário desejado'}
                </Text>
            </FormAnnotation>
       </>
    )
}