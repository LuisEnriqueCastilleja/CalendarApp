export const getEnvVariables = () => {
    //Para importar las variables de entorno
    import.meta.env;
    return {
        ...import.meta.env
    }
}