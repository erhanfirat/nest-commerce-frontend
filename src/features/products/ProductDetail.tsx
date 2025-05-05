import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  TextField,
  ButtonGroup,
} from "@mui/material";
import { AppDispatch, RootState } from "../../app/store";
import { fetchProductById } from "./productSlice";
import { addToCart } from "../cart/cartSlice";
import ProductImageGallery from "../../components/ProductImageGallery";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const {
    selectedProduct: product,
    loading,
    error,
  } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(parseInt(id)));
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ product, quantity }));
    }
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (value > 0 && product && value <= product.stock) {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box p={2}>
        <Alert severity="info">Ürün bulunamadı.</Alert>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
          },
          gap: 4,
        }}
      >
        <Box>
          <ProductImageGallery images={product.images} title={product.name} />
        </Box>
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h4" component="h1" gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                {product.price} TL
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Stok: {product.stock} adet
              </Typography>
              <Box mt={3}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                    },
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <TextField
                      type="number"
                      label="Adet"
                      value={quantity}
                      onChange={handleQuantityChange}
                      inputProps={{ min: 1, max: product.stock }}
                      fullWidth
                    />
                  </Box>
                  <Box>
                    <ButtonGroup fullWidth>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/products")}
                      >
                        Geri Dön
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                      >
                        Sepete Ekle
                      </Button>
                    </ButtonGroup>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductDetail;
