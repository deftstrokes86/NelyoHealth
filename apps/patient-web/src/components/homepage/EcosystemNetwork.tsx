"use client";

import {
  Background,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
  type NodeProps
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./ecosystem-network.css";
import { AnimatePresence, motion } from "framer-motion/react";
import { X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useContent } from "@nelyohealth/ui-foundation";
import {
  CANVAS,
  CENTER,
  centerNode,
  orbitNodes,
  positionForAngle,
  type EcosystemNodeSpec,
  type LucideGlyph
} from "./ecosystem-nodes";

type EcosystemNodeData = {
  contentPrefix: string;
  icon: LucideGlyph;
  isCenter?: boolean;
  active?: boolean;
  hovered?: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
};

type EcosystemNode = Node<EcosystemNodeData, "ecosystem">;

const EcosystemNodeView = ({ id, data }: NodeProps<EcosystemNode>) => {
  const title = useContent(`${data.contentPrefix}.title`);
  const isCenter = Boolean(data.isCenter);
  const Icon = data.icon;
  return (
    <button
      type="button"
      className={
        "nh-ecosystem__node" +
        (isCenter ? " nh-ecosystem__node--center" : "") +
        (data.active ? " nh-ecosystem__node--active" : "") +
        (data.hovered ? " nh-ecosystem__node--hovered" : "")
      }
      aria-pressed={data.active}
      aria-label={title.title}
      onClick={() => data.onSelect(id)}
      onMouseEnter={() => data.onHover(id)}
      onMouseLeave={() => data.onHover(null)}
      onFocus={() => data.onHover(id)}
      onBlur={() => data.onHover(null)}
    >
      <Handle type="target" position={Position.Top} className="nh-ecosystem__handle" isConnectable={false} />
      <Handle type="source" position={Position.Bottom} className="nh-ecosystem__handle" isConnectable={false} />
      <span className="nh-ecosystem__node-icon" aria-hidden>
        <Icon
          size={isCenter ? 40 : 26}
          strokeWidth={isCenter ? 1.7 : 1.9}
        />
      </span>
      <span className="nh-ecosystem__node-label">{title.title}</span>
    </button>
  );
};

const nodeTypes = { ecosystem: EcosystemNodeView };

const buildNodes = (
  selectedId: string | null,
  hoveredId: string | null,
  onSelect: (id: string) => void,
  onHover: (id: string | null) => void
): EcosystemNode[] => {
  const shared = { onSelect, onHover };
  const center: EcosystemNode = {
    id: centerNode.id,
    type: "ecosystem",
    position: { x: CENTER.x - 84, y: CENTER.y - 84 },
    draggable: false,
    selectable: false,
    data: {
      contentPrefix: centerNode.contentPrefix,
      icon: centerNode.icon,
      isCenter: true,
      active: selectedId === centerNode.id,
      hovered: hoveredId === centerNode.id,
      ...shared
    }
  };
  const orbit = orbitNodes.map<EcosystemNode>((spec: EcosystemNodeSpec) => {
    const pos = positionForAngle(spec.angleDegrees);
    return {
      id: spec.id,
      type: "ecosystem",
      position: { x: pos.x - 60, y: pos.y - 60 },
      draggable: false,
      selectable: false,
      data: {
        contentPrefix: spec.contentPrefix,
        icon: spec.icon,
        active: selectedId === spec.id,
        hovered: hoveredId === spec.id,
        ...shared
      }
    };
  });
  return [center, ...orbit];
};

const buildEdges = (activeId: string | null): Edge[] =>
  orbitNodes.map((spec) => ({
    id: `patient-${spec.id}`,
    source: centerNode.id,
    target: spec.id,
    animated: activeId === null ? true : activeId === spec.id,
    style: {
      stroke:
        activeId === spec.id
          ? "var(--nh-color-action)"
          : "var(--nh-color-border-strong)",
      strokeWidth: activeId === spec.id ? 1.6 : 1.2,
      strokeDasharray: "6 8",
      opacity: activeId === null || activeId === spec.id ? 0.9 : 0.35,
      transition: "opacity 200ms ease, stroke 200ms ease, stroke-width 200ms ease"
    }
  }));

interface DetailCardProps {
  contentPrefix: string;
  onDismiss: () => void;
}

const DetailCard = ({ contentPrefix, onDismiss }: DetailCardProps) => {
  const title = useContent(`${contentPrefix}.title`);
  const detail = useContent(`${contentPrefix}.body`);
  return (
    <motion.aside
      className="nh-ecosystem__detail"
      role="dialog"
      aria-label={title.title}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className="nh-ecosystem__detail-head">
        <p className="nh-ecosystem__detail-eyebrow">{detail.title}</p>
        <button
          type="button"
          className="nh-ecosystem__detail-close"
          onClick={onDismiss}
          aria-label="Close role detail"
        >
          <X size={16} strokeWidth={2} aria-hidden />
        </button>
      </header>
      <h3 className="nh-ecosystem__detail-title">{title.title}</h3>
      <p className="nh-ecosystem__detail-lead">{title.body}</p>
      <p className="nh-ecosystem__detail-body">{detail.body}</p>
    </motion.aside>
  );
};

interface MobileCardProps {
  spec: EcosystemNodeSpec;
}

const MobileCard = ({ spec }: MobileCardProps) => {
  const title = useContent(`${spec.contentPrefix}.title`);
  const detail = useContent(`${spec.contentPrefix}.body`);
  const Icon = spec.icon;
  return (
    <article className="nh-ecosystem__mobile-card">
      <header className="nh-ecosystem__mobile-head">
        <span className="nh-ecosystem__mobile-icon" aria-hidden>
          <Icon size={22} strokeWidth={1.9} />
        </span>
        <div>
          <p className="nh-ecosystem__mobile-eyebrow">{detail.title}</p>
          <h3 className="nh-ecosystem__mobile-title">{title.title}</h3>
        </div>
      </header>
      <p className="nh-ecosystem__mobile-lead">{title.body}</p>
      <p className="nh-ecosystem__mobile-body">{detail.body}</p>
    </article>
  );
};

const EcosystemNetworkInner = () => {
  const eyebrow = useContent("marketing-home.ecosystem.eyebrow");
  const headline = useContent("marketing-home.ecosystem.headline");
  const subheadline = useContent("marketing-home.ecosystem.subheadline");
  const hint = useContent("marketing-home.ecosystem.hint");
  const cta = useContent("marketing-home.ecosystem.cta");
  const patientCenter = useContent("marketing-home.ecosystem.patient.title");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const handleSelect = useCallback((id: string) => {
    setSelectedId((current) => (current === id ? null : id));
  }, []);

  const handleHover = useCallback((id: string | null) => {
    setHoveredId(id);
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [selectedId]);

  const nodes = useMemo(
    () => buildNodes(selectedId, hoveredId, handleSelect, handleHover),
    [selectedId, hoveredId, handleSelect, handleHover]
  );
  const edges = useMemo(
    () => buildEdges(selectedId ?? hoveredId ?? null),
    [selectedId, hoveredId]
  );

  const selectedSpec =
    selectedId === centerNode.id
      ? { contentPrefix: centerNode.contentPrefix }
      : orbitNodes.find((spec) => spec.id === selectedId) ?? null;

  return (
    <section
      ref={sectionRef}
      className="nh-ecosystem"
      aria-labelledby="nh-ecosystem-heading"
    >
      <div className="nh-ecosystem__inner">
        <header className="nh-ecosystem__header">
          <p className="nh-ecosystem__eyebrow">{eyebrow.title}</p>
          <h2 id="nh-ecosystem-heading" className="nh-ecosystem__headline">
            {headline.title}
          </h2>
          <p className="nh-ecosystem__subheadline">{subheadline.body}</p>
        </header>

        <div className="nh-ecosystem__stage" aria-hidden="false">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            proOptions={{ hideAttribution: true }}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag={false}
            panOnScroll={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            preventScrolling={false}
            minZoom={0.4}
            maxZoom={1.2}
            defaultViewport={{ x: 0, y: 0, zoom: 0.72 }}
            translateExtent={[
              [-40, -40],
              [CANVAS.width + 40, CANVAS.height + 40]
            ]}
            className="nh-ecosystem__flow"
          >
            <Background gap={32} size={1} color="var(--nh-color-border)" />
          </ReactFlow>
          <p className="nh-ecosystem__center-caption" aria-hidden>
            {patientCenter.title}
          </p>

          <AnimatePresence>
            {selectedSpec ? (
              <DetailCard
                key={selectedId}
                contentPrefix={selectedSpec.contentPrefix}
                onDismiss={() => setSelectedId(null)}
              />
            ) : null}
          </AnimatePresence>
        </div>

        <p className="nh-ecosystem__hint">{hint.title}</p>

        <div className="nh-ecosystem__mobile" role="list">
          {orbitNodes.map((spec) => (
            <div key={spec.id} role="listitem" className="nh-ecosystem__mobile-slot">
              <MobileCard spec={spec} />
            </div>
          ))}
        </div>

        <div className="nh-ecosystem__cta">
          <a className="nh-ecosystem__cta-primary" href="/contact">
            {cta.title}
          </a>
        </div>
      </div>
    </section>
  );
};

export const EcosystemNetwork = () => (
  <ReactFlowProvider>
    <EcosystemNetworkInner />
  </ReactFlowProvider>
);
