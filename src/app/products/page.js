"use client"

import NavHeader
  from "@/components/layout/header"

import ProductForm
  from "@/components/product/insertForm"

export default function ProductsPage() {

  return (

    <div className="min-h-screen p-4 space-y-6">
      <NavHeader pageName="Add Product" />
      <ProductForm />
    </div>
  )
}