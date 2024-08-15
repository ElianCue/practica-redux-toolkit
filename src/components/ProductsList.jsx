import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createProducts, deleteProducts, readProducts, updateProducts } from "../redux/productsSlice"

const ProductsList = () =>{
    const products = useSelector((state) => state.products)
    const dispatch = useDispatch()

    const [newProductName, setNewProductName] = useState("")
    const [editedProduct, setEditedProduct] = useState(null)
    const [deletedProduct, setDeletedProduct] = useState(null)

    useEffect(() =>{
        axios
            .get("http://localhost:3001/products")
            .then((res) =>{
                console.log(res.data)
                dispatch(readProducts(res.data))
            })
            .catch((err) => console.error(err))
    }, [dispatch])

    const handleCreateProduct = () =>{
        if (newProductName) {
            const newProduct = { id: Date.now(), name: newProductName};
            dispatch(createProducts(newProduct))


            axios
                .post("http://localhost:3001/products", newProduct)
                .then(() => {
                    setNewProductName("");
                })
                .catch((err) => console.error(err))

        }
    }
    const handleUpdateProduct = () =>{
        if(editedProduct) {
            dispatch(updateProducts({id: editedProduct.id, name: editedProduct.name}))
        }

        axios.put(`http://localhost:3001/products/${editedProduct.id}`, {
            name: editedProduct.name
        }).then(() => setEditedProduct(null))
        .catch((err) => console.error(err))
    }
    const handleDeleteProduct = (product) => {
        if (product) {
            dispatch(deleteProducts({ id: product.id })); // Cambia a la acción correcta
    
            axios
                .delete(`http://localhost:3001/products/${product.id}`)
                .then(() => {
                    setDeletedProduct(null); // Restablece el estado local
                })
                .catch((err) => console.error(err));
        }
    };
    


    return (
        <>
            <h2>CRUD de productos</h2>
            <h2>Lista de productos</h2>
            <ul>
                {products.data.map((product) => (
                    <li key={product.id}>
                        {editedProduct?.id === product.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editedProduct.name}
                                    onChange={(e) =>
                                        setEditedProduct({ ...editedProduct, name: e.target.value })
                                    }
                                />
                                <button onClick={handleUpdateProduct}>Actualizar</button>
                            </div>
                        ) : (
                            <div>
                                <span>{product.name}</span>
                                <button onClick={() => handleDeleteProduct(product)}>Eliminar</button>
                                <button onClick={() => setEditedProduct(product)}>Editar</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <aside>
                <input type="text" value={newProductName} onChange={(e) => setNewProductName(e.target.value)}></input>
                <button onClick={handleCreateProduct}>Agregar producto</button>
            </aside>
        </>
    )
}

export default ProductsList