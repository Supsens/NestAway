import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const listingId = params.Listingid;
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();
        console.log(data);
        if (data.success===false) {
          toast.error(data.message);
          setError(data.message);
          setLoading(false);
          return;
        }
        setListing(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.Listingid]);

  console.log(listing);

  return (
    <main>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && listing && (
        <>
          {listing.imageUrls && listing.imageUrls.length > 0 && (
            <Swiper navigation>
              {listing.imageUrls.map((url, index) => (
                <SwiperSlide key={url}>
                  <div
                    className="h-[550px]"
                    style={{ background:`url(${url}) center no-repeat`, backgroundSize: "cover" }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </>
      )}

      <ToastContainer />
    </main>
  );
};

export default Listing;
