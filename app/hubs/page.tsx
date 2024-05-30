"use client";
import ReactSwagger from "../components/react-swagger";
import hubsSwaggerDocument from "../swagger/hubs.json";

export default function IndexPage() {
  return (
    <section className="container">
      <ReactSwagger spec={hubsSwaggerDocument} />
    </section>
  );
}
