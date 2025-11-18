// Tech Radar Visualization
// Based on Zalando Tech Radar (MIT License)
// Simplified for easy maintenance

function radar_visualization(config) {
  // Configuration defaults
  config.width = config.width || 1450;
  config.height = config.height || 1000;
  config.colors = config.colors || { background: "#fff", grid: '#dddde0', inactive: "#ddd" };
  config.print_layout = config.print_layout !== undefined ? config.print_layout : true;
  config.font_family = config.font_family || "Arial, Helvetica";
  config.scale = config.scale || 1;

  // Random number generator (reproducible)
  var seed = 42;
  function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  function random_between(min, max) {
    return min + random() * (max - min);
  }

  function normal_between(min, max) {
    return min + (random() + random()) * 0.5 * (max - min);
  }

  // Quadrant positions
  const quadrants = [
    { radial_min: 0, radial_max: 0.5, factor_x: 1, factor_y: 1 },
    { radial_min: 0.5, radial_max: 1, factor_x: -1, factor_y: 1 },
    { radial_min: -1, radial_max: -0.5, factor_x: -1, factor_y: -1 },
    { radial_min: -0.5, radial_max: 0, factor_x: 1, factor_y: -1 }
  ];

  // Ring sizes
  const rings = [
    { radius: 130 },
    { radius: 220 },
    { radius: 310 },
    { radius: 400 }
  ];

  // Coordinate transformations
  function polar(cartesian) {
    return {
      t: Math.atan2(cartesian.y, cartesian.x),
      r: Math.sqrt(cartesian.x * cartesian.x + cartesian.y * cartesian.y)
    };
  }

  function cartesian(polar) {
    return {
      x: polar.r * Math.cos(polar.t),
      y: polar.r * Math.sin(polar.t)
    };
  }

  function bounded_interval(value, min, max) {
    return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
  }

  function bounded_ring(polar, r_min, r_max) {
    return { t: polar.t, r: bounded_interval(polar.r, r_min, r_max) };
  }

  function bounded_box(point, min, max) {
    return {
      x: bounded_interval(point.x, min.x, max.x),
      y: bounded_interval(point.y, min.y, max.y)
    };
  }

  // Calculate segment for positioning
  function segment(quadrant, ring) {
    var polar_min = {
      t: quadrants[quadrant].radial_min * Math.PI,
      r: ring === 0 ? 30 : rings[ring - 1].radius
    };
    var polar_max = {
      t: quadrants[quadrant].radial_max * Math.PI,
      r: rings[ring].radius
    };
    var cartesian_min = {
      x: 15 * quadrants[quadrant].factor_x,
      y: 15 * quadrants[quadrant].factor_y
    };
    var cartesian_max = {
      x: rings[3].radius * quadrants[quadrant].factor_x,
      y: rings[3].radius * quadrants[quadrant].factor_y
    };
    return {
      clipx: function(d) {
        var c = bounded_box(d, cartesian_min, cartesian_max);
        var p = bounded_ring(polar(c), polar_min.r + 15, polar_max.r - 15);
        d.x = cartesian(p).x;
        return d.x;
      },
      clipy: function(d) {
        var c = bounded_box(d, cartesian_min, cartesian_max);
        var p = bounded_ring(polar(c), polar_min.r + 15, polar_max.r - 15);
        d.y = cartesian(p).y;
        return d.y;
      },
      random: function() {
        return cartesian({
          t: random_between(polar_min.t, polar_max.t),
          r: normal_between(polar_min.r, polar_max.r)
        });
      }
    };
  }

  // Position entries randomly in their segments
  for (var i = 0; i < config.entries.length; i++) {
    var entry = config.entries[i];
    entry.segment = segment(entry.quadrant, entry.ring);
    var point = entry.segment.random();
    entry.x = point.x;
    entry.y = point.y;
    entry.color = entry.active || config.print_layout ? 
      config.rings[entry.ring].color : config.colors.inactive;
  }

  // Organize entries by quadrant and ring
  var segmented = [];
  for (let quadrant = 0; quadrant < 4; quadrant++) {
    segmented[quadrant] = [];
    for (var ring = 0; ring < 4; ring++) {
      segmented[quadrant][ring] = [];
    }
  }
  for (var i = 0; i < config.entries.length; i++) {
    var entry = config.entries[i];
    segmented[entry.quadrant][entry.ring].push(entry);
  }

  // Assign IDs
  var id = 1;
  for (let quadrant of [2, 3, 1, 0]) {
    for (var ring = 0; ring < 4; ring++) {
      var entries = segmented[quadrant][ring];
      entries.sort((a, b) => a.label.localeCompare(b.label));
      for (var i = 0; i < entries.length; i++) {
        entries[i].id = "" + id++;
      }
    }
  }

  function translate(x, y) {
    return "translate(" + x + "," + y + ")";
  }

  // Create SVG
  var svg = d3.select("svg#radar")
    .style("background-color", config.colors.background)
    .attr("width", config.width * config.scale)
    .attr("height", config.height * config.scale);

  var radar = svg.append("g")
    .attr("transform", translate(config.width / 2, config.height / 2));

  var grid = radar.append("g");

  // Draw grid lines
  grid.append("line")
    .attr("x1", 0).attr("y1", -400)
    .attr("x2", 0).attr("y2", 400)
    .style("stroke", config.colors.grid)
    .style("stroke-width", 1);
  
  grid.append("line")
    .attr("x1", -400).attr("y1", 0)
    .attr("x2", 400).attr("y2", 0)
    .style("stroke", config.colors.grid)
    .style("stroke-width", 1);

  // Background filter for legend
  var defs = grid.append("defs");
  var filter = defs.append("filter")
    .attr("x", 0).attr("y", 0)
    .attr("width", 1).attr("height", 1)
    .attr("id", "solid");
  filter.append("feFlood").attr("flood-color", "rgb(0, 0, 0, 0.8)");
  filter.append("feComposite").attr("in", "SourceGraphic");

  // Draw rings
  for (var i = 0; i < rings.length; i++) {
    grid.append("circle")
      .attr("cx", 0).attr("cy", 0)
      .attr("r", rings[i].radius)
      .style("fill", "none")
      .style("stroke", config.colors.grid)
      .style("stroke-width", 1);
    
    if (config.print_layout) {
      grid.append("text")
        .text(config.rings[i].name)
        .attr("y", -rings[i].radius + 62)
        .attr("text-anchor", "middle")
        .style("fill", config.rings[i].color)
        .style("opacity", 0.35)
        .style("font-family", config.font_family)
        .style("font-size", "42px")
        .style("font-weight", "bold")
        .style("pointer-events", "none")
        .style("user-select", "none");
    }
  }

  // Legend positioning
  const legend_offset = [
    { x: 450, y: 90 },
    { x: -675, y: 90 },
    { x: -675, y: -310 },
    { x: 450, y: -310 }
  ];

  function legend_transform(quadrant, ring, index) {
    var dx = ring < 2 ? 0 : 140;
    var dy = (index == null ? -16 : index * 12);
    if (ring % 2 === 1) {
      dy = dy + 36 + segmented[quadrant][ring - 1].length * 12;
    }
    return translate(legend_offset[quadrant].x + dx, legend_offset[quadrant].y + dy);
  }

  // Draw title and legend
  if (config.print_layout) {
    radar.append("text")
      .attr("transform", translate(-675, -420))
      .text(config.title)
      .style("font-family", config.font_family)
      .style("font-size", "30px")
      .style("font-weight", "bold");

    radar.append("text")
      .attr("transform", translate(-675, -400))
      .text(config.date || "")
      .style("font-family", config.font_family)
      .style("font-size", "14px")
      .style("fill", "#999");

    radar.append("text")
      .attr("transform", translate(-155, 450))
      .text("▲ moved up     ▼ moved down     ★ new     ⬤ no change")
      .attr("xml:space", "preserve")
      .style("font-family", config.font_family)
      .style("font-size", "12px");

    // Legend
    const legend = radar.append("g");
    for (let quadrant = 0; quadrant < 4; quadrant++) {
      legend.append("text")
        .attr("transform", translate(legend_offset[quadrant].x, legend_offset[quadrant].y - 45))
        .text(config.quadrants[quadrant].name)
        .style("font-family", config.font_family)
        .style("font-size", "18px")
        .style("font-weight", "bold");
      
      for (let ring = 0; ring < 4; ring++) {
        legend.append("text")
          .attr("transform", legend_transform(quadrant, ring))
          .text(config.rings[ring].name)
          .style("font-family", config.font_family)
          .style("font-size", "12px")
          .style("font-weight", "bold")
          .style("fill", config.rings[ring].color);
        
        legend.selectAll(".legend" + quadrant + ring)
          .data(segmented[quadrant][ring])
          .enter()
          .append("text")
          .attr("transform", (d, i) => legend_transform(quadrant, ring, i))
          .attr("class", "legend" + quadrant + ring)
          .attr("id", d => "legendItem" + d.id)
          .text(d => d.id + ". " + d.label)
          .style("font-family", config.font_family)
          .style("font-size", "11px")
          .on("mouseover", (event, d) => { showBubble(d); highlightLegendItem(d); })
          .on("mouseout", (event, d) => { hideBubble(d); unhighlightLegendItem(d); });
      }
    }
  }

  // Blips layer
  var rink = radar.append("g").attr("id", "rink");

  // Tooltip bubble
  var bubble = radar.append("g")
    .attr("id", "bubble")
    .attr("x", 0).attr("y", 0)
    .style("opacity", 0)
    .style("pointer-events", "none")
    .style("user-select", "none");
  
  bubble.append("rect")
    .attr("rx", 4).attr("ry", 4)
    .style("fill", "#333");
  
  bubble.append("text")
    .style("font-family", config.font_family)
    .style("font-size", "10px")
    .style("fill", "#fff");
  
  bubble.append("path")
    .attr("d", "M 0,0 10,0 5,8 z")
    .style("fill", "#333");

  function showBubble(d) {
    if (d.active || config.print_layout) {
      var tooltip = d3.select("#bubble text").text(d.label);
      var bbox = tooltip.node().getBBox();
      d3.select("#bubble")
        .attr("transform", translate(d.x - bbox.width / 2, d.y - 16))
        .style("opacity", 0.8);
      d3.select("#bubble rect")
        .attr("x", -5)
        .attr("y", -bbox.height)
        .attr("width", bbox.width + 10)
        .attr("height", bbox.height + 4);
      d3.select("#bubble path")
        .attr("transform", translate(bbox.width / 2 - 5, 3));
    }
  }

  function hideBubble(d) {
    d3.select("#bubble")
      .attr("transform", translate(0, 0))
      .style("opacity", 0);
  }

  function highlightLegendItem(d) {
    var legendItem = document.getElementById("legendItem" + d.id);
    if (legendItem) {
      legendItem.setAttribute("filter", "url(#solid)");
      legendItem.setAttribute("fill", "white");
    }
  }

  function unhighlightLegendItem(d) {
    var legendItem = document.getElementById("legendItem" + d.id);
    if (legendItem) {
      legendItem.removeAttribute("filter");
      legendItem.removeAttribute("fill");
    }
  }

  // Draw blips
  var blips = rink.selectAll(".blip")
    .data(config.entries)
    .enter()
    .append("g")
    .attr("class", "blip")
    .attr("transform", d => translate(d.x, d.y))
    .on("mouseover", (event, d) => { showBubble(d); highlightLegendItem(d); })
    .on("mouseout", (event, d) => { hideBubble(d); unhighlightLegendItem(d); });

  // Configure each blip
  blips.each(function(d) {
    var blip = d3.select(this);

    // Blip shape based on movement
    if (d.moved == 1) {
      blip.append("path")
        .attr("d", "M -11,5 11,5 0,-13 z") // up triangle
        .style("fill", d.color);
    } else if (d.moved == -1) {
      blip.append("path")
        .attr("d", "M -11,-5 11,-5 0,13 z") // down triangle
        .style("fill", d.color);
    } else if (d.moved == 2) {
      blip.append("path")
        .attr("d", d3.symbol().type(d3.symbolStar).size(200))
        .style("fill", d.color);
    } else {
      blip.append("circle")
        .attr("r", 9)
        .style("fill", d.color);
    }

    // Add text label on the blip
    if (d.active || !config.print_layout) {
      blip.append("text")
        .text(d.label)
        .attr("y", 3)
        .attr("text-anchor", "middle")
        .style("fill", "#000")
        .style("font-family", config.font_family)
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .style("pointer-events", "none")
        .style("user-select", "none");
    }
  });

  // Draw quadrant labels
  for (let i = 0; i < 4; i++) {
    radar.append("text")
      .attr("transform", translate(
        quadrants[i].factor_x * 300,
        quadrants[i].factor_y * 300
      ))
      .text(config.quadrants[i].name)
      .style("font-family", config.font_family)
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .style("text-anchor", "middle")
      .style("pointer-events", "none")
      .style("user-select", "none");
  }
}