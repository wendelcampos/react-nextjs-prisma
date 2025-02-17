/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { Container, Form, FormError, Header } from "./styles";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "@/src/lib/axios";

const registerFormSchema = z.object({
    username: z
        .string()
        .min(3, { message: 'O nome de usuário deve ter no mínimo 3 caracteres' })
        .regex(/^([a-z\\-]+)$/i, { message: 'O nome de usuário só pode conter letras e hífens' })
        .transform((username) => username.toLowerCase()),
    name: z
        .string()
        .min(3, { message: 'O nome deve ter no mínimo 3 letras' })
})

type RegisterFormData = z.infer<typeof registerFormSchema>;

/* eslint-disable react/react-in-jsx-scope */
export default function Register() {
    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormSchema)
    });

    const router = useRouter()

    useEffect(() => {
        if(router.query?.username) {
            setValue('username', String(router.query.username))
        }
    }, [router.query?.username, setValue])

    async function handleRegister({ username, name }: RegisterFormData) {
        try {
            await api.post('/users', {
                name: name,
                username: username
            })
        } catch (err: any) {
            console.log(err)
        }
    }

    return (
       <Container>
            <Header>
                <Heading  as='strong'>Bem-vindo ao Ignite Call!</Heading>
                <Text>
                    Precisamos de algumas informações para criar seu perfil! Ah, você pode
                    editar essas informações depois
                </Text>

                <MultiStep size={4} currentStep={1}></MultiStep>
            </Header>
            <Form as='form' onSubmit={handleSubmit(handleRegister)}>
                <label>
                    <Text size="sm">Nome de usúario</Text>
                    <TextInput prefix="ignite.com/" placeholder='seu-usúario' { ...register('username') }/>
                    
                    { errors.username && (
                        <FormError size="sm">
                            { errors.username.message }
                        </FormError>
                    )}
          
                </label>
                <label>
                    <Text size="sm">Nome completo</Text>
                    <TextInput placeholder='Seu nome' { ...register('name') }/>
                    { errors.username && (
                        <FormError size="sm">
                            { errors.username.message }
                        </FormError>
                    )}
                </label>
                <Button type='submit' disabled={isSubmitting}>
                    Próximo passo
                    <ArrowRight />
                </Button>
            </Form>
       </Container>
    );
}