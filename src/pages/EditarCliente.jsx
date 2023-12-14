import {
  Form,
  useNavigate,
  useLoaderData,
  redirect,
  useActionData,
} from "react-router-dom";
import { actualizarCliente, obtenerCliente } from "../data/clientes";
import Formulario from "../components/Formulario";
import Error from "../components/Error";

export async function loader({ params }) {
  const cliente = await obtenerCliente(params.clienteId);

  if (Object.values(cliente).length === 0) {
    throw new Response("", {
      status: 400,
      statusText: "No hay resultados",
    });
  }

  return cliente;
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const datos = Object.fromEntries(formData);
  const email = formData.get("email");

  const errores = [];
  //Validaciones
  if (Object.values(datos).includes("")) {
    errores.push("Todos los ampos son obligatorios");
  }

  let regex = new RegExp(
    "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
  );

  if (!regex.test(email)) {
    errores.push("El email no es válido");
  }

  // Retornar datos si hay errores
  if (Object.keys(errores).length > 0) {
    return errores;
  }

  await actualizarCliente(params.clienteId, datos);
  return redirect("/");
}

const EditarCliente = () => {
  const navigate = useNavigate();
  const cliente = useLoaderData();
  const errores = useActionData();
  return (
    <>
      <h1 className="font-black text-4xl text-blue-900">Editar Cliente</h1>
      <p className="mt-3">
        A continuación podrás modificar los datos de un cliente
      </p>
      <div className="flex justify-end">
        <button
          className="bg-blue-800 text-white px-3 py-1 font-bold uppercase"
          onClick={() => navigate("/")}
        >
          Volver
        </button>
      </div>

      <div className="bg-white shadow rounded-md md:w-3/4 mx-auto px-5 py-10 mt-10">
        {errores?.length &&
          errores.map((error, i) => {
            return <Error key={i}>{error}</Error>;
          })}
        <Form method="post" noValidate>
          <Formulario cliente={cliente} />

          <input
            type="submit"
            className="bg-blue-800 text-white text-lg uppercase mt-5 w-full p-3 cursor-pointer"
            value="Guardar cambios"
          />
        </Form>
      </div>
    </>
  );
};

export default EditarCliente;
