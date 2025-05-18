import { RegisterFormController, RegisterFormModel } from "./RegisterForm.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIntl } from "react-intl";
import * as yup from "yup";
import { isUndefined } from "lodash";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useAppRouter } from "@infrastructure/hooks/useAppRouter";
import { useAppDispatch } from "@application/store";
import { setToken } from "@application/state-slices";
import { toast } from "react-toastify";
import {
    AuthControllerApi,
    RegisterDto,
    Configuration
} from "../../../../api/api8081";

const getDefaultValues = (initialData?: { email: string; username: string }) => {
    const defaultValues = {
        email: "",
        username: "",
        password: ""
    };

    if (!isUndefined(initialData)) {
        return {
            ...defaultValues,
            ...initialData,
        };
    }

    return defaultValues;
};

const useInitRegisterForm = () => {
    const { formatMessage } = useIntl();
    const defaultValues = getDefaultValues();

    const schema = yup.object().shape({
        email: yup.string()
            .required(formatMessage(
                { id: "globals.validations.requiredField" },
                {
                    fieldName: formatMessage({ id: "globals.email" }),
                }))
            .email()
            .default(defaultValues.email),
        username: yup.string()
            .required(formatMessage(
                { id: "globals.validations.requiredField" },
                {
                    fieldName: formatMessage({ id: "globals.username" }),
                }))
            .default(defaultValues.username),
        password: yup.string()
            .required(formatMessage(
                { id: "globals.validations.requiredField" },
                {
                    fieldName: formatMessage({ id: "globals.password" }),
                }))
            .min(6, formatMessage({ id: "globals.validations.passwordMinLength" }))
            .default(defaultValues.password),
    });

    const resolver = yupResolver(schema);

    return { defaultValues, resolver };
}

export const useRegisterFormController = (): RegisterFormController => {
    const { formatMessage } = useIntl();
    const { defaultValues, resolver } = useInitRegisterForm();
    const { redirectToHome } = useAppRouter();
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();

    const submit = useCallback(async (data: RegisterFormModel) => {
        const configuration = new Configuration({ basePath: "http://localhost:8081" });
        const api = new AuthControllerApi(configuration);

        try {
            // ⚠️ Folosim .registerRaw ca să primim răspunsul brut (Response)
            const response = await api.registerRaw({ registerDto: data });

            toast(formatMessage({ id: "notifications.messages.registrationSuccess" }));
            redirectToHome();
        } catch (err) {
            console.error("🔴 Register failed:", err);
            toast.error(formatMessage({ id: "notifications.errors.registrationFailed" }));
        }
    }, [redirectToHome, formatMessage]);


    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<RegisterFormModel>({
        defaultValues,
        resolver
    });

    return {
        actions: {
            handleSubmit,
            submit,
            register
        },
        computed: {
            defaultValues,
            isSubmitting
        },
        state: {
            errors
        }
    }
}
