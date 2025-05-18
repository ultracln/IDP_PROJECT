import { FormController } from "../FormController";
import {
    UseFormHandleSubmit,
    UseFormRegister,
    FieldErrorsImpl,
    DeepRequired
} from "react-hook-form";

export type RegisterFormModel = {
    username: string;
    email: string;
    password: string;
};

export type RegisterFormState = {
    errors: FieldErrorsImpl<DeepRequired<RegisterFormModel>>;
};

export type RegisterFormActions = {
    register: UseFormRegister<RegisterFormModel>;
    handleSubmit: UseFormHandleSubmit<RegisterFormModel>;
    submit: (body: RegisterFormModel) => void;
};

export type RegisterFormComputed = {
    defaultValues: RegisterFormModel,
    isSubmitting: boolean
};

export type RegisterFormController = FormController<RegisterFormState, RegisterFormActions, RegisterFormComputed>;