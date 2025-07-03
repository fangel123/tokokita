import { Star } from "lucide-react";
import useApi from "../../hooks/useApi";

const DashboardReviewsPage = () => {
  const { data: reviews, loading, error } = useApi("/seller/reviews");

  if (loading) return <p className="text-center py-10">Memuat review...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Review Produk Anda
      </h1>
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-center py-10 text-gray-500">
            Belum ada review untuk produk Anda.
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg">{review.product.name}</p>
                  <p className="text-sm text-gray-500">
                    Oleh: {review.user.name}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <span className="font-bold text-lg">{review.rating}</span>
                  <Star className="w-5 h-5 fill-current" />
                </div>
              </div>
              <p className="mt-4 italic text-gray-700">"{review.comment}"</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardReviewsPage;
