import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  createProduct,
  updateProduct,
  setSelectedProduct,
  clearSelectedProduct,
} from "./productSlice";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  images: string[];
}

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedProduct, loading, error } = useAppSelector(
    (state) => state.products
  );
  const { user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    stock: "",
    images: [""],
  });

  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    if (id && selectedProduct) {
      setFormData({
        name: selectedProduct.name,
        description: selectedProduct.description,
        price: selectedProduct.price,
        stock: selectedProduct.stock.toString(),
        images: selectedProduct.images,
      });
    }
  }, [id, selectedProduct]);

  useEffect(() => {
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()],
      }));
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      return;
    }

    const productData = {
      ...formData,
      price: formData.price,
      stock: parseInt(formData.stock),
      images: formData.images.filter((url) => url.trim() !== ""),
    };

    try {
      if (id) {
        await dispatch(
          updateProduct({ id: parseInt(id), data: productData })
        ).unwrap();
      } else {
        await dispatch(createProduct(productData)).unwrap();
      }
      navigate("/products");
    } catch (err) {
      console.error("Failed to save product:", err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" m={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          {id ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Ürün Adı"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={4}
            id="description"
            label="Açıklama"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="price"
            label="Fiyat"
            name="price"
            type="text"
            value={formData.price}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="stock"
            label="Stok"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
          />

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Ürün Resimleri
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label="Resim URL"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
              />
              <IconButton
                color="primary"
                onClick={handleAddImage}
                disabled={!newImageUrl.trim()}
              >
                <AddIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {formData.images.map((image, index) => (
                <Chip
                  key={index}
                  label={`Resim ${index + 1}`}
                  onDelete={() => handleRemoveImage(index)}
                  deleteIcon={<DeleteIcon />}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {id ? "Güncelle" : "Ekle"}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate("/products")}
            >
              İptal
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
