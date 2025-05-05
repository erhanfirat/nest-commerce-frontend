import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Pagination,
  Stack,
  ButtonGroup,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../app/store";
import { fetchProducts, setPage } from "./productSlice";
import ProductImageGallery from "../../components/ProductImageGallery";
import { addToCart } from "../cart/cartSlice";

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    items: products,
    loading,
    error,
    pagination,
  } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(
      fetchProducts({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
      })
    );
  }, [dispatch, pagination.currentPage, pagination.itemsPerPage]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    dispatch(setPage(value));
  };

  const handleAddToCart = (product: any) => {
    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.images[0],
        quantity: 1,
      })
    );
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

  if (!products || products.length === 0) {
    return (
      <Box p={2}>
        <Alert severity="info">Henüz ürün bulunmamaktadır.</Alert>
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
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        {products.map((product) => (
          <Box key={product.id}>
            <Card>
              <ProductImageGallery
                images={product.images}
                title={product.name}
              />
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary" mt={1}>
                  {product.price} TL
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Stok: {product.stock} adet
                </Typography>
                <ButtonGroup variant="contained" fullWidth sx={{ mt: 2 }}>
                  <Button
                    color="primary"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    Detaylar
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    Sepete Ekle
                  </Button>
                </ButtonGroup>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
      <Stack spacing={2} alignItems="center" mt={4}>
        <Pagination
          count={pagination.totalPages}
          page={pagination.currentPage}
          onChange={handlePageChange}
          color="primary"
          size="large"
        />
        <Typography variant="body2" color="text.secondary">
          Toplam {pagination.totalItems} ürün, {pagination.totalPages} sayfa
        </Typography>
      </Stack>
    </Box>
  );
};

export default ProductList;
